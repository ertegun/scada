## Scada Web Diagram App | Gruparge
 ## Gereklilikler ve Versiyonlar

    - PHP ^7.2
    - Laravel Framework Verison 8
    - Composer
    - Git

 ## Windows/Linux Kurulum
    - git clone repoUrl (Github'taki proje çekilecek.)
    - composer install (paket ve bağımlılıklar kurulacak.)
    - .env dosyası eklenecek.
    - config/database.php dosyasında databese bilgileri girilecek.
    - php artisan key:generate
## Linux/Docker Container İzinler 
    - chmod -R 777 storage
    - chmod -R 777 bootstrap/cache
    
 ## Önemli Notlar 
     - Windows sunucuda komutlar çalışmıyorsa, komutları yönetici olarak çalıştırın.
## PhpDocker Kurulumu
    - docker-compose build
    - docker-compose up -d (Konsolu meşgul etmeden çalıştırmak için)
    - docker-compose down (Durdurmak için)
    - docker exec -it spwebscada-php-fpm bash (yada sh gibi komut satırı tipini belirtmek gerekiyor)
    - composer install (vendor u yüklemek için)
    - php artisan key:generate
    - exit (container konsolundan çıkmak için)