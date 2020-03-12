# Kubernetes Deployment

## AnyCable-Go

AnyCable-Go can be easily deployed to your Kubernetes cluster using Helm and [our official Helm chart][anycable-helm].

 1. Add it as a dependency to your main application:

    ```yaml
    # Chart.yaml
    dependencies:
    - name: anycable-go
      version: 0.2.4
      repository: https://helm.anycable.io/
    ```

    Check the latest Helm chart version at [github.com/anycable/anycable-helm/releases](https://github.com/anycable/anycable-helm/releases).

 1. And then configure it in your application values within `anycable-go` namespace:

    ```yaml
    # values.yaml
    anycable-go:
      env:
        # Assuming that Ruby RPC is available in K8s in the same namespace as anycable-rpc service (see next chapter)
        anycableRpcHost: anycable-rpc:50051
      ingress:
        enable: true
        path: /cable

    # values/production.yaml
    anycable-go:
      env:
        # Assuming that Redis is available in K8s in the same namespace as redis-anycable service
        anycableRedisUrl: redis://:password@redis-anycable:6379/0
      ingress:
        acme: # if you're using Let's Encrypt
          hosts:
            - your-app.com
    ```

Read the [chart’s README][anycable-helm] for more info.

## Ruby RPC server

To run Ruby counterpart of AnyCable which will handle connection authentication and execute your business logic we need to create a separate deployment and a corresponding service for it.

 1. [**Deployment**](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) that will spin up required number of pods and handle rolling restarts on deploys

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: anycable-rpc
      labels:
        component: anycable-rpc
    spec:
      replicas: 1
      strategy:
        type: RollingUpdate
        rollingUpdate:
          maxUnavailable: 1
          maxSurge: 0
      selector:
        matchLabels:
          component: anycable-rpc
      template:
        metadata:
          labels:
            component: anycable-rpc
        spec:
          containers:
            - name: anycable-rpc
              image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
              imagePullPolicy: IfNotPresent
              command:
                - bundle
                - exec
                - anycable
                - !!str --rpc-host=0.0.0.0:50051
              env:
                - name: ANYCABLE_REDIS_URL
                  value: "redis://:password@redis-anycable:6379/0" # Same as for anycable-go
                  # or, better, place it into secrets for better security:
                  # valueFrom:
                  #   secretKeyRef:
                  #     name: "anycable-go-secrets"
                  #     key: anycableRedisUrl
              resources:
                limits:
                  cpu: 500m
                  memory: 700Mi
                requests:
                  cpu: 200m
                  memory: 400Mi
    ```

 1. [**Service**](https://kubernetes.io/docs/concepts/services-networking/service/) to connect anycable-go with RPC server.

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: anycable-rpc
      labels:
        component: anycable-rpc
    spec:
      selector:
        component: anycable-rpc
      type: ClusterIP
      ports:
        - port: 50051
          targetPort: 50051
          protocol: TCP
    ```

 1. (Optional) [**network policy**](https://kubernetes.io/docs/concepts/services-networking/network-policies/) will restrict access to pods running RPC service to only those that runs anycable-go daemon in the same namespace.

    ```yaml
    kind: NetworkPolicy
    apiVersion: networking.k8s.io/v1
    metadata:
      name: restrict-access-to-anycable-rpc
    spec:
      podSelector:
        matchLabels:
          component: anycable-rpc
      ingress:
        - from:
          - podSelector:
              matchLabels:
                component: anycable-go
    ```

    See detailed explanation in the docs and in this example: [Kubernetes network policy recipes: deny traffic from other namespaces](https://github.com/ahmetb/kubernetes-network-policy-recipes/blob/60f5b12f274472901ce79463ce0ba3a8f98b9a48/04-deny-traffic-from-other-namespaces.md)

[anycable-helm]: https://github.com/anycable/anycable-helm/ "Helm charts for installing any cables into a Kubernetes cluster"
