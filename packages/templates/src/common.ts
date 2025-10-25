import type { ModConfig } from '@necesse-modding/types';
import * as os from 'node:os';
import { getGradleWrapperFiles } from './gradleWrapper.js';

export function getCommonFiles(config: ModConfig): Record<string, string> {
  const files: Record<string, string> = {};

  files['settings.gradle'] = `plugins {
    // Apply the foojay-resolver plugin to allow automatic download of JDKs
    id 'org.gradle.toolchains.foojay-resolver-convention' version '1.0.0'
}
  rootProject.name = '${config.modName.replace(/\s+/g, '')}'`;

  const jarName = `\${project.ext.modName.replace(" ", "")}-\${project.ext.gameVersion}-\${project.ext.modVersion}`;

  files['build.gradle'] = `plugins {
    id 'java'
}

// Change the values below this to your mods values
// To change the project name, edit the settings.gradle file

project.ext.modID = "${config.modId}" // The unique id of your mod. Must be all lowercase and cannot use special characters.
project.ext.modName = "${config.modName}" // The display name of your mod.
project.ext.modVersion = "${config.modVersion}" // Your current builds version. Must follow the xx.xx... format.
project.ext.gameVersion = "${config.gameVersion}" // The target game version.
project.ext.modDescription = "${config.description}" // Short description of what your mod is.
project.ext.author = "${config.author}" // Your name

/**
 * When setting clientside to true, it means servers do not need this mod for clients to connect and vice versa.
 * IMPORTANT: If you set this to true, make sure that your mod does not add any content or do anything
 * that could cause clients and servers to desync. This includes registering any items, objects, tiles, packets etc.
 */
project.ext.clientside = ${config.clientside}

/**
 * The other mod dependencies of this mod
 * Dependencies define the default load order of mods
 * Uncomment and configure these if your mod has dependencies
 */
//project.ext.modDependencies = ["other.modid1", "other.modid2"]
//project.ext.modOptionalDependencies = ["optional.modid1", "optional.modid2"]

// The path to the games install directory
def gameDirectory = "${config.gameDirectory.replace(/\\/g, '/')}"

// =================================================
// ========== DO NOT EDIT BELOW THIS LINE ==========
// =================================================

// Name of the jar
def jarName = "${jarName}"
def modOutputDir = file("$buildDir/mod")

group = project.ext.modID
version = project.ext.modVersion

// Apply a specific Java toolchain to ease working on different environments.
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25) // Latest as of now
        vendor = JvmVendorSpec.ADOPTIUM
    }

    // Compile to Java 8 bytecode for runtime compatibility while using a newer toolchain for compilation
    // The Necesse game requires Java 8 bytecode as specified on the Necesse wiki.
    sourceCompatibility = "$JavaVersion.VERSION_1_8"
    targetCompatibility = "$JavaVersion.VERSION_1_8"

}

tasks.withType(JavaCompile).configureEach {
    // If toolchain is used, this will instruct javac to output class files for Java 8
    options.release.set(8)
    options.encoding = "UTF-8"
    // Suppress warnings about obsolete Java 8 source/target options (until necesse devs decide to update the java version)
    options.compilerArgs += ["-Xlint:-options"]
}

repositories {
    mavenCentral()
}

configurations {
    libDepends
}

// FIXED: Updated syntax for Gradle 9.1.0
sourceSets {
    main {
        java {
            destinationDirectory.set(new File(modOutputDir, "classes"))
        }
       
        output.resourcesDir = new File(modOutputDir, "resources")
       
        // Adds libDepends configuration to classpath
        compileClasspath += configurations.libDepends
    }
}

def buildLocation = "build/jar/"

if (!file(gameDirectory + "/Necesse.jar").exists()) {
    throw new Exception("Could not find game install directory. Make sure it is correct in build.gradle file.")
}

dependencies {
    implementation files(gameDirectory + "/Necesse.jar")
    implementation fileTree(gameDirectory + "/lib/")
    implementation fileTree("./mods/") // Add all mods located in local mods folder

    // Add any third party library dependencies here. Remember to use libDepends, so that they will be added to your jar on build
    // These are some examples:
//    libDepends group: 'com.google.guava', name: 'guava', version: '31.1-jre'
//    libDepends files("path/to/library/jar.jar")
}

task createAppID {
    group = "necesse"
    description = "Creates steam_appid.txt file"

    doLast {
        file("steam_appid.txt").text = "1169040"
    }
}

task createModInfoFile(type: JavaExec) {
    group = "necesse"
    description = "Creates the mod info file"

    classpath = files(gameDirectory + "/Necesse.jar")
  doFirst {
    sourceSets.main.java.destinationDirectory.get().asFile.mkdirs()
  }

  mainClass.set("CreateModInfoFile")
    args = ["-file", "\${sourceSets.main.java.destinationDirectory.get()}/mod.info",
            "-id", "\${project.ext.modID}",
            "-name", "\${project.ext.modName}",
            "-version", "\${project.ext.modVersion}",
            "-gameVersion", "\${project.ext.gameVersion}",
            "-description", "\${project.ext.modDescription}",
            "-author", "\${project.ext.author}",
            "-clientside", "\${project.ext.clientside}",
            "-dependencies", project.ext.has("modDependencies") ? "[" + project.ext.modDependencies.join(", ") + "]" : "",
            "-optionalDependencies", project.ext.has("modOptionalDependencies") ? "[" + project.ext.modOptionalDependencies.join(", ") + "]" : ""]
}
// Makes compiling also create mod info file
tasks.named('classes') {
    dependsOn("createModInfoFile")
}

task runClient(type: JavaExec) {
    group = "necesse"
    description = "Run client with current mod"
    dependsOn("buildModJar", "createAppID")

    classpath = files(gameDirectory + "/Necesse.jar")

    jvmArgs = ["-Xms512m", "-Xmx4G", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseG1GC", "-XX:G1NewSizePercent=20", "-XX:G1ReservePercent=20", "-XX:MaxGCPauseMillis=50", "-XX:G1HeapRegionSize=32M"]
    args = ["-dev", "-mod \\"\${buildLocation}\\""]
}

task runDevClient(type: JavaExec) {
    group = "necesse"
    description = "Run client with current mod"
    dependsOn("buildModJar", "createAppID")

    classpath = files(gameDirectory + "/Necesse.jar")

    jvmArgs = ["-Xms512m", "-Xmx4G", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseG1GC", "-XX:G1NewSizePercent=20", "-XX:G1ReservePercent=20", "-XX:MaxGCPauseMillis=50", "-XX:G1HeapRegionSize=32M"]
    args = ["-dev 1", "-mod \\"\${buildLocation}\\""]
}

task runServer(type: JavaExec) {
    group = "necesse"
    description = "Run server with current mod"
    dependsOn("buildModJar")

    classpath = files(gameDirectory + "/Server.jar")

    mainClass.set("StartServer")
    jvmArgs = ["-Xms512m", "-Xmx4G", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseG1GC", "-XX:G1NewSizePercent=20", "-XX:G1ReservePercent=20", "-XX:MaxGCPauseMillis=50", "-XX:G1HeapRegionSize=32M"]
    args = ["-mod \\"\${buildLocation}\\""]
}

task buildModJar(type: Jar) {
    group = "necesse"
    description = "Generates the mod jar into the build folder"
    dependsOn("classes")

    doFirst {
        fileTree(dir: buildLocation).exclude("\${jarName}.jar").visit { FileVisitDetails details ->
            delete details.file
        }
    }

  // Add compiled classes and generated resources
  from sourceSets.main.java.destinationDirectory.get()
  // Add resources under 'resources/' prefix in JAR
  from(sourceSets.main.output.resourcesDir) {
    into 'resources'
  }
  // Add the dependencies
  from configurations.libDepends.collect { it.isDirectory() ? it : zipTree(it) }

    archiveFileName.set("\${jarName}.jar")
    destinationDirectory.set(file(buildLocation))
}
`;

  files['README.md'] = `# ${config.modName}

${config.description}

## Author
${config.author}

## Installation
\`\`\`bash
gradle buildModJar
\`\`\`

The mod will automatically copy to your Necesse mods folder.

## Development

\`\`\`bash
gradle runDevClient
\`\`\`

`;

  files['.gitignore'] = `.gradle/
build/
out/
.vscode/
.idea/
*.class
*.jar
*.war
*.log
.DS_Store
Thumbs.db
`;

  if (config.includeVSCode) {
    files['.vscode/settings.json'] = JSON.stringify(
      {
        'java.configuration.updateBuildConfiguration': 'automatic',
        'java.compile.nullAnalysis.mode': 'automatic',
        'files.exclude': {
          '**/.gradle': true,
          '**/build': true,
        },
        'java.project.sourcePaths': ['src/main/java'],
        'java.project.referencedLibraries': [
          'lib/**/*.jar',
          `${config.gameDirectory.replace(/\\/g, '/')}/Necesse.jar`,
        ],
      },
      null,
      2
    );

    files['.vscode/tasks.json'] = JSON.stringify(
      {
        version: '2.0.0',
        tasks: [
          {
            label: 'Build Mod Jar',
            type: 'shell',
            command:
              os.platform() === 'win32' ? '.\\gradlew.bat buildModJar' : './gradlew buildModJar',
            group: { kind: 'build', isDefault: true },
          },
          {
            label: 'Clean Build',
            type: 'shell',
            command:
              os.platform() === 'win32' ? '.\\gradlew.bat clean build' : './gradlew clean build',
            group: 'build',
          },
          {
            label: 'Run Dev Client',
            type: 'shell',
            command:
              os.platform() === 'win32' ? '.\\gradlew.bat runDevClient' : './gradlew runDevClient',
            group: 'none',
          },
        ],
      },
      null,
      2
    );

    files['.vscode/extensions.json'] = JSON.stringify(
      {
        recommendations: ['vscjava.vscode-java-pack'],
      },
      null,
      2
    );
  }

  // Add Gradle wrapper files if requested
  if (config.includeWrapper !== false) {
    const wrapperFiles = getGradleWrapperFiles();
    Object.assign(files, wrapperFiles);
  }

  return files;
}
