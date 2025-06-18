FROM nginx:alpine

# Hapus konfigurasi default nginx
RUN rm /etc/nginx/conf.d/default.conf

# Salin konfigurasi kustom
COPY default.conf /etc/nginx/conf.d/

# Salin semua file statis ke direktori html nginx
COPY . /usr/share/nginx/html
