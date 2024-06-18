install nginx 

1. Reverse Proxy Nginx
```bash
sudo apt-get install -y nginx 
run ip, not wokring then htto open secirity
cd /etc/nginx/sites-available

sudo vim default

location /api { 
 rewrite ^\/api\/(.*)$ /api/$1 break;
 proxy_pass  http://localhost:3000;
 proxy_set_header Host $host;
 proxy_set_header X-Real-IP $remote_addr;
 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}


sudo systemctl restart nginx
```

2. Add domain to nginx configuration


```bash
server_name shopdev.anonystick.com www.shopdev.anonystick.com;

location / {
    proxy_pass http://localhost:3000; 
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

3. add SSL to domain 

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx -d shopdev.anonystick.com
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```


4. Install mysql8.4 on linux server 2003 - EC2 AWS
```bash
    dnf check-update -- check update dnf
    get https://dev.mysql.com/get/mysql84-community-release-el9-1.noarch.rpm -- download mysql 8.4
    sudo dnf install mysql84-community-release-el9-1.noarch.rpm -- install mysql by dnf
    sudo dnf install mysql-community-server 
    sudo systemctl status mysqld
    sudo systemctl start mysqld
    sudo cat /var/log/mysqld.log | grep "password" -- get temporary password
    sudo mysql -uroot -p 
    enter temp password
    alter user 'root'@'localhost' identified by 'p@ssword'
    try login mysql with new password
    
5. Import sql file 
```bash
    source <filename>
    create databse database-name
    