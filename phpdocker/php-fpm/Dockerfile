FROM phpdockerio/php72-fpm:latest
WORKDIR "/application"

# Fix debconf warnings upon build
ARG DEBIAN_FRONTEND=noninteractive

# Install selected extensions and other stuff
RUN apt-get update \
    && apt-get -y --no-install-recommends install  php7.2-mysql php7.2-xdebug php7.2-bcmath php7.2-bz2 php7.2-dba php7.2-enchant php7.2-gd php7.2-gmp php7.2-igbinary php7.2-imagick php7.2-interbase php7.2-intl php7.2-mongodb php7.2-msgpack php7.2-odbc php7.2-phpdbg php7.2-pspell php7.2-raphf php7.2-recode php7.2-soap php7.2-ssh2 php7.2-sybase php7.2-tideways php7.2-tidy php7.2-xmlrpc php7.2-xsl php7.2-xhprof php7.1-yaml \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# Install git
RUN apt-get update \
    && apt-get -y install git \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*