FROM tomcat:9.0.98-jdk8-temurin-noble


ENV JAVA_OPTS="-Xmx4096m -Xms4096m"

COPY ./hti-ss-web/target/ss-tool.war /usr/local/tomcat/webapps/ss-tool.war
COPY ./dockerConfigs/webapp/context.xml /usr/local/tomcat/conf/context.xml

CMD ["catalina.sh", "run"]