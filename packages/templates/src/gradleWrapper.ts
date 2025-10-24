export function getGradleWrapperFiles(): Record<string, string> {
  const files: Record<string, string> = {};

  // Gradle wrapper properties only
  // User should run 'gradle wrapper' to generate gradlew and gradlew.bat scripts
  files['gradle/wrapper/gradle-wrapper.properties'] = [
    'distributionBase=GRADLE_USER_HOME',
    'distributionPath=wrapper/dists',
    'distributionUrl=https\\://services.gradle.org/distributions/gradle-9.1.0-bin.zip',
    'networkTimeout=10000',
    'validateDistributionUrl=true',
    'zipStoreBase=GRADLE_USER_HOME',
    'zipStorePath=wrapper/dists',
    '',
  ].join('\n');

  return files;
}
