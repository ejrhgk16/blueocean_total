FROM mysql:8.0

# 한글 지원을 위한 기본 문자셋 설정
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=blueocean
ENV MYSQL_USER=BLUEOCEANUSER
ENV MYSQL_PASSWORD=BLUEOCEAN

# init/ 디렉토리의 SQL 파일을 컨테이너 초기화 경로에 복사
# MySQL은 이 디렉토리의 .sql 파일을 알파벳 순으로 자동 실행합니다
COPY init/ /docker-entrypoint-initdb.d/

# CI 성능 최적화 설정
COPY my-ci.cnf /etc/mysql/conf.d/my-ci.cnf
