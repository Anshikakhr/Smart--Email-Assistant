# Use official OpenJDK 17 image as base
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy all files into the container
COPY . .

# Make the mvnw script executable
RUN chmod +x mvnw

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose the port your app runs on (Render will map this)
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "target/*.jar"]

