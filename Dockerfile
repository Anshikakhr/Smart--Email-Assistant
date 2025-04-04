# Use official OpenJDK 17 image as base
FROM eclipse-temurin:17-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and mvnw files first to leverage Docker cache for dependencies
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Install Maven dependencies
RUN ./mvnw dependency:resolve

# Copy the rest of the project
COPY . .

# Expose the port your app runs on (usually 8080 for Spring Boot apps)
EXPOSE 8080

# Run the Spring Boot application without a JAR (directly using Maven)
CMD ["./mvn", "spring-boot:run"]


