Yo, cool arr-like web app for those music library server owners. Note that I say "arr-like" because it doesn't have an artist tracking implementation yet, but it will in the future!

Just use the docker-compose file or build the image yourself with the Dockerfile. You'll have to add your own credentials for it to work, it's under "settings" options. As of now, I have only tested that it works with Deezer and Qobuz.

# THIS IS IN BETA

If you encounter any error, please, please, please submit an issue describing the error and share the output of docker logs <your_container_name> (the latter can be found with `docker ps`). 

# Deezer config

As such:
![image](https://github.com/user-attachments/assets/c2bc3719-a2e7-4617-9279-21e73e596996)

# Qobuz config

As such:
![image](https://github.com/user-attachments/assets/dc9bec8d-e8e8-4d04-b83a-49947d516b44)

Note that you can get your appId and appSecret [here](https://gist.github.com/vitiko98/bb89fd203d08e285d06abf40d96db592)
