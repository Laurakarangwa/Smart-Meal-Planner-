
# Smart Meal Planner Web App

The **Smart Meal Planner** is a web application that wisely advises the users on the right and helpful meals to take, referring to goal they have related to their weight and fitness. It also provides the youtube link of how to prepare those meals. When you need more meals, it again regenerates the plan for you continuously. 

This README documents how the app was containerized using Docker, deployed on two web servers, and served through a load balancer (HAProxy).

---

## Docker Hub Repository

- **Repository URL**: [Docker Hub](https://hub.docker.com/repository/docker/laurakarangwa/smartmealplanner/general)
- **Image Name**: `laurakarangwa/smartmealplanner	`
- **Tags**:
  - `latest`

---

## Build Instructions

To build the Docker image locally:

```bash
docker build -t smartmealplanner:latest laurakarangwa/smartmealplanner:latest
```
### Tag and push to Docker Hub:
```
docker tag docker tag smartmealplanner:latest laurakarangwa/smartmealplanner:latest
docker push docker push laurakarangwa/smartmealplanner:latest
```
### Run Instructions (Web01 & Web02)
On Web01 and Web02:
```
docker pull laurakarangwa/smartmealplanner:latest
```
### HAProxy Configuration (on Lb01)
```
frontend http-in
    bind *:80
    default_backend servers

backend servers
    balance roundrobin
    server web01 172.20.0.11:80 check
    server web02 172.20.0.12:80 check
    http-response set-header X-Served-By %[srv_name]
```
### Install HAProxy inside lb-01
```
sudo apt update && sudo apt install -y haproxy
```
### Reload and restart HAProxy
```
sudo vim /etc/haproxy/haproxy.cfg # apply changes
sudo service haproxy restart # restart haproxy cfg
```
### Testing & Verification
##### Step 1: Access the Application via Load Balancer
```
curl -I http://localhost:8082
```

Use .env file:
```
docker run --env-file .env laurakarangwa/smartmealplanner:latest
```
### Getting Started

- `Web browsers (Chrome, Edge, etc.)`
- `An internet connection to fetch Smart Meal Planner from Spoonacular Food API`

### Installation
#### Clone the repository:
```
git clone https://github.com/Laurakarangwa/Smart-Meal-Planner-.git
cd Smart-Meal-Planner-
```
#### YouTube Link
```
https://www.youtube.com/watch?v=TKhKE-HGo8Q
```
Developed by:

***Laura KARANGWA KWIZERA***





# Smart-Meal-Planner-
The following are the screenshots of my app running in browser 
<img width="1366" height="691" alt="web-01" src="https://github.com/user-attachments/assets/50d842c3-3e69-491f-ba84-f639ab507f3e" />
<img width="1366" height="687" alt="web-02" src="https://github.com/user-attachments/assets/d119ae72-8842-4137-bce5-232e9046f3ab" />
<img width="1362" height="692" alt="loadbalancer" src="https://github.com/user-attachments/assets/77938a30-775f-4037-953f-77251a7c901d" />
