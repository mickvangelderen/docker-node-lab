FROM mcr.microsoft.com/mssql/server:2019-CU4-ubuntu-16.04

# USER root
# RUN mkdir -p /usr/src/database \
#     && chown -R mssql /usr/src/database
# USER msssql

# WORKDIR /usr/src/database

# COPY *.sql ./

CMD [ "/opt/mssql/bin/sqlservr" ]
