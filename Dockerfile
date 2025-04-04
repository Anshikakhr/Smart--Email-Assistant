# Use official OpenJDK 17 image
FROM eclipse-temurin:17-jdk

# Set the working directory
WORKDIR /app

# Copy Maven files first for caching
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY . .

# Package the application
RUN ./mvnw clean package -DskipTests

# Expose port (default Spring Boot port)
EXPOSE 8080

# Run the packaged JAR
CMD ["java", "-jar", "target/smart-email-assistant-0.0.1-SNAPSHOT.jar"]



