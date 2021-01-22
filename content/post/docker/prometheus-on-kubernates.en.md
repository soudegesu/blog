---
title: "Building a Prometheus, Grafana and pushgateway cluster with Kubernates"
description: "This article is my notes on practicing building a cluster of Prometheus, Grafana and pushgateway in Kubernates environment."
date: "2021-01-22T14:28:08+09:00"
thumbnail: "/images/icons/k8s_horizontal_icon.png"
categories:
  - "docker"
tags:
  - "docker"
  - "kubernates"
  - "prometheus"
  - "grafana"
  - "pushgateway"
isCJKLanguage: true
twitter_card_image: /images/icons/k8s_horizontal_icon.png
---

This article is my notes on practicing building a cluster of [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/) and [pushgateway](https://github.com/prometheus/pushgateway) in [Kubernates](https://kubernetes.io/) environment.

The repository is located at [soudegesu/prometheus-pushgw-practice](https://github.com/soudegesu/prometheus-pushgw-practice) .

<!--adsense-->

## Goals

- Building a [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/) and [pushgateway](https://github.com/prometheus/pushgateway) cluster with [Kubernates](https://kubernetes.io/)
- [Grafana](https://grafana.com/) references [Prometheus](https://prometheus.io/) as a datasource.
- [Prometheus](https://prometheus.io/) pull metrics from [pushgateway](https://github.com/prometheus/pushgateway).

For now, I will aim to build a cluster on a local machine. 
These goals outline is as shown in the following figure.

![purpose](/images/20210122/purpose.drawio.png)

## Environment

- Mac OS X `11.1`
- Docker Desktop `3.0.0`
  - Docker `20.1.0`
  - Kubernates `1.19.3`

## Example of Kubernates configuration file

The procedure is based on [this article](https://qiita.com/FY0323/items/72616d6e280ec7f2fdaf) and expanding the parts I want personally.

### Specify the Kubernates Context

This time, specify `docker-desktop`.

{{< highlight bash "linenos=inline" >}}
kubectl config use-context docker-desktop
{{</ highlight >}}

Also, set the namespace to `monitoring`.

{{< highlight bash "linenos=inline" >}}
kubectl create namespace monitoring
{{</ highlight >}}

<!--adsense-->

### Create ClusterRole and ClusterRoleBinding

Create `ClusterRole` and `ClusterRoleBinding`. You can change kinds to `Role` and `RoleBinding` and use them.

{{< highlight yaml "linenos=inline" >}}
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
- apiGroups: [""]
  resources:
  - nodes
  - nodes/proxy
  - services
  - endpoints
  - pods
  verbs: ["get", "list", "watch"]
- apiGroups:
  - extensions
  resources:
  - ingresses
  verbs: ["get", "list", "watch"]
- nonResourceURLs: ["/metrics"]
  verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
- kind: ServiceAccount
  name: default
  namespace: monitoring
{{</ highlight >}}

### Create a pushgateway server

Next, create a definition for [pushgateway](https://github.com/prometheus/pushgateway).
A `Deployment` and a `Service` definition are in the following example.
Other Pods can access to pushgateway service with `pushgateway-service:8120`.

{{< highlight yaml "linenos=inline" >}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pushgateway-deployment
  namespace: monitoring
  labels:
    app: pushgateway-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: pushgateway-server
  template:
    metadata:
      labels:
        app: pushgateway-server
    spec:
      containers:
        - name: pushgateway
          image: prom/pushgateway:latest
          ports:
            - containerPort: 9091
---
apiVersion: v1
kind: Service
metadata:
  name: pushgateway-service
spec:
  selector: 
    app: pushgateway-server
  type: NodePort
  ports:
    - port: 8120
      targetPort: 9091
      nodePort: 30040
{{</ highlight >}}

<!--adsense-->

### Create a Prometheus server

Then, create definition of [Prometheus](https://prometheus.io/). Create a `ConfigMap` in addition to `Deployment` and `Service`.

Define a configuration file (`prometheus.yml`) for [Prometheus](https://prometheus.io/) in ConfigMap and mount it.

Other Pods can access to Prometheus service with `prometheus-service:8080`.

{{< highlight yaml "linenos=inline,hl_lines=33-37 60 65-71" >}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-server-conf
  labels:
    name: prometheus-server-conf
  namespace: monitoring
data:
  prometheus.yml: |-
    # my global config
    global:
      scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
      evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
      # scrape_timeout is set to the global default (10s).
    # Alertmanager configuration
    alerting:
      alertmanagers:
      - static_configs:
        - targets:
          # - alertmanager:9093
    # Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
    rule_files:
      # - "first_rules.yml"
      # - "second_rules.yml"
    # A scrape configuration containing exactly one endpoint to scrape:
    # Here it's Prometheus itself.
    scrape_configs:
      # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
      - job_name: 'prometheus'
        static_configs:
        - targets: ['localhost:9090']
      
      - job_name: 'pushgateway'
        honor_labels: true
        metrics_path: /metrics
        static_configs:
        - targets: ['pushgateway-service:8120']
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus-deployment
  namespace: monitoring
  labels:
    app: prometheus-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus-server  
  template:
    metadata:
      labels:
        app: prometheus-server
    spec:
      containers:
        - name: prometheus
          image: prom/prometheus:latest
          args:
            - "--config.file=/etc/config/prometheus.yml"
            - "--storage.tsdb.path=/prometheus/"
            - "--storage.tsdb.retention=3d"
          ports:
            - containerPort: 9090
          volumeMounts:
            - name: config-vol
              mountPath: /etc/config
      volumes:
        - name: config-vol
          configMap:
            name: prometheus-server-conf
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus-service
spec:
  selector: 
    app: prometheus-server
  type: NodePort
  ports:
    - port: 8080
      targetPort: 9090 
      nodePort: 30000            
{{</ highlight >}}

### Create a Grafana server

Then, Create [Grafana](https://grafana.com/) definition, In following sample, `Deployment` and `Service` and `ConfigMap` are defined.

The definition file is a little bit long, but I create a configuration file here as well with ConfigMap. The ConfigMap definition includes `data source definition`, `dashboard definition`, and `dashboard configuration`.

As for the dashboard settings, editing them from a configuration file is time-consuming, so it is better to export the definitions JSON file from the GUI and paste it.

{{< highlight yaml "linenos=inline,hl_lines=17" >}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources-conf
  labels:
    name: grafana-datasources-conf
  namespace: monitoring
data:
  datasources.yml: |-
    apiVersion: 1
    datasources:
    - name: Prometheus
      type: prometheus
      access: proxy
      orgId: 1
      uid: 1
      url: http://prometheus-service:8080/
      basicAuth: false
      editable: true
      version: 1
      isDefault: true
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards-conf
  labels:
    name: grafana-dashboards-conf
  namespace: monitoring
data:
  dashboards.yml: |-
    apiVersion: 1
    providers:
    - name: 'hoge'
      orgId: 1
      folder: ''
      type: file
      disableDeletion: true
      editable: true
      options:
        path: /var/lib/grafana/dashboards
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards-settings
  labels:
    name: grafana-dashboards-settings
  namespace: monitoring
data:
  hoge.json: |
    {
      "annotations": {
        "list": [
          {
            "builtIn": 1,
            "datasource": "-- Grafana --",
            "enable": true,
            "hide": true,
            "iconColor": "rgba(0, 211, 255, 1)",
            "name": "Annotations & Alerts",
            "type": "dashboard"
          }
        ]
      },
      "editable": true,
      "gnetId": null,
      "graphTooltip": 0,
      "id": 1,
      "links": [],
      "panels": [
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "custom": {}
            },
            "overrides": []
          },
          "fill": 1,
          "fillGradient": 0,
          "gridPos": {
            "h": 9,
            "w": 12,
            "x": 0,
            "y": 0
          },
          "hiddenSeries": false,
          "id": 2,
          "legend": {
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": false
          },
          "lines": true,
          "linewidth": 1,
          "nullPointMode": "null",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "7.3.7",
          "pointradius": 2,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "expr": "go_gc_duration_seconds",
              "interval": "",
              "legendFormat": "",
              "refId": "A"
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeRegions": [],
          "timeShift": null,
          "title": "Panel Title",
          "tooltip": {
            "shared": true,
            "sort": 0,
            "value_type": "individual"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            }
          ],
          "yaxis": {
            "align": false,
            "alignLevel": null
          }
        }
      ],
      "schemaVersion": 26,
      "style": "dark",
      "tags": [],
      "templating": {
        "list": []
      },
      "time": {
        "from": "now-6h",
        "to": "now"
      },
      "timepicker": {},
      "timezone": "",
      "title": "sample",
      "uid": "UpBk6EfGz",
      "version": 1
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana-deployment
  namespace: monitoring
  labels:
    app: grafana-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana-server
  template:
    metadata:
      labels:
        app: grafana-server
    spec:
      containers:
        - name: grafana
          image: grafana/grafana:latest
          # args:
          #  - "--config=/etc/config/datasources/datasources.yml"
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: datasources-config-vol
              mountPath: /etc/grafana/provisioning/datasources
            - name: dashboards-config-vol
              mountPath: /etc/grafana/provisioning/dashboards
            - name: dashboards-settings-vol
              mountPath: /var/lib/grafana/dashboards
      volumes:
        - name: datasources-config-vol
          configMap:
            name: grafana-datasources-conf
        - name: dashboards-config-vol
          configMap:
            name: grafana-dashboards-conf
        - name: dashboards-settings-vol
          configMap:
            name: grafana-dashboards-settings
---
apiVersion: v1
kind: Service
metadata:
  name: grafana-service
spec:
  selector: 
    app: grafana-server
  type: NodePort
  ports:
    - port: 8100
      targetPort: 3000
      nodePort: 30020
{{</ highlight >}}

<!--adsense-->

### apply definitions

Finally, run the `kubectl apply` command to deploy the container.

{{< highlight bash "linenos=inline" >}}
kubectl apply -f ${name of pushgateway k8s file}.yml -n monitoring
kubectl apply -f ${name of prometheus k8s file}.yml -n monitoring
kubectl apply -f ${name of grafana k8s file}.yml -n monitoring
{{</ highlight >}}

Open the dashboard of Docker Desktop and you can see the deployment container has been created successfully.
After that, open your browser and access the following URL to make sure that the service console is displayed.

- Prometheus: `http://localhost:30000/`
- grafana: `http://localhost:30020/`

## Conclusion

Created a configuration to build [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/) and [pushgateway](https://github.com/prometheus/pushgateway) in the [Kubernates](https://kubernetes.io/)
In the scope of this work, the storage volume of [Prometheus](https://prometheus.io/) is not mounted externally, so if you need it, please configure it accordingly.
