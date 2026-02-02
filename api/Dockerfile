# Stage 1: build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /build

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src src

RUN ./mvnw clean package -DskipTests

# Stage 2: runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /deployments

RUN adduser -D -u 185 -g root jboss
COPY --from=build --chown=jboss:root /build/target/quarkus-app/lib/ lib/
COPY --from=build --chown=jboss:root /build/target/quarkus-app/*.jar .
COPY --from=build --chown=jboss:root /build/target/quarkus-app/app/ app/
COPY --from=build --chown=jboss:root /build/target/quarkus-app/quarkus/ quarkus/

USER jboss
EXPOSE 8080
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar quarkus-run.jar"]
