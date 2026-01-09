FROM php:8.4-fpm-alpine

WORKDIR /var/www

RUN apk add --no-cache \
    git \
    curl \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip 

# php extensions
RUN docker-php-ext-install pdo_mysql mbstring 

# install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# app files
COPY . /var/www

# install dependencises
RUN composer install --no-dev --optimize-autoloader

# copy env file
RUN cp .env.example .env \
    && php artisan key:generate

# #set permissions
# RUN chown -R www-data:www-data /var/www \
#     && chmod -R 755 /var/www/storage
RUN mkdir -p /var/www/storage/framework/{sessions,views,cache} \
    && mkdir -p /var/www/storage/logs \
    && mkdir -p /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
