# ---------- Build Stage ----------
FROM openjdk:17-jdk-slim AS build

# Install Maven
RUN apt update && apt install -y maven

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY email-writer/pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY email-writer/src ./src

# Build the application without tests
RUN mvn clean package -DskipTests


# ---------- Runtime Stage ----------
FROM openjdk:17-jdk-slim

# Set working directory inside the runtime container
WORKDIR /app

# Create a non-root user to avoid permission issues
RUN useradd -m appuser
USER appuser

# Copy the exact JAR file from the build stage
COPY --from=build /app/target/email-writer-sb-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the app port
EXPOSE 8080

# Run the JAR
CMD ["java", "-jar", "/app/app.jar"]





