-- cập nhật apt và apt-get
sudo apt-get update
sudo apt update

-- tải JQ, Nodejs, npm. java, golang
sudo apt install nodejs
sudo apt install jq
sudo apt install npm 
sudo apt install curl


-- tải java và thiết lập môi trường 
sudo apt-get install openjdk-8-jdk
-- cài đặt môi trường
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java

-- cài đặt docker 
sudo apt-get install docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose


-- tải hyperledger về 
git clone https://github.com/hyperledger/fabric-samples.git
