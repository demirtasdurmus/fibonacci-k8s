docker build -t demirtasdurmus/client-k8s:latest -t demirtasdurmus/client-k8s:$SHA -f ./client/Dockerfile ./client
docker build -t demirtasdurmus/api-k8s-pgfix:latest -t demirtasdurmus/api-k8s-pgfix:$SHA -f ./server/Dockerfile ./server
docker build -t demirtasdurmus/worker-k8s:latest -t demirtasdurmus/worker-k8s:$SHA -f ./worker/Dockerfile ./worker

docker push demirtasdurmus/client-k8s:latest
docker push demirtasdurmus/api-k8s-pgfix:latest
docker push demirtasdurmus/worker-k8s:latest

docker push demirtasdurmus/client-k8s:$SHA
docker push demirtasdurmus/api-k8s-pgfix:$SHA
docker push demirtasdurmus/worker-k8s:$SHA

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=demirtasdurmus/api-k8s-pgfix:$SHA
kubectl set image deployments/client-deployment client=demirtasdurmus/client-k8s:$SHA
kubectl set image deployments/worker-deployment worker=demirtasdurmus/worker-k8s:$SHA