# magazine-full/Dockerfile

FROM maven:3.9-eclipse-temurin-21 AS build

# Recreate the same sibling layout your local pom.xml expects (../frontend)
COPY frontend /frontend
WORKDIR /app
COPY magazine/pom.xml .
COPY magazine/.mvn .mvn
COPY magazine/mvnw .
COPY magazine/src src
RUN chmod +x mvnw && ./mvnw -B clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]