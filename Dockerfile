# Use official OpenJDK 17 image
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy Maven wrapper and grant execute permissions
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the full project
COPY . .

# Package the application
RUN ./mvnw clean package -DskipTests

# Expose the port
EXPOSE 8080

# Run the JAR
CMD ["java", "-jar", "target/smart-email-assistant-0.0.1-SNAPSHOT.jar"]




