---
title: "KubernatesでPrometheusとGrafanaとpushgatewayを構築する"
description: "Kubernates環境でPrometheusとGrafanaとpushgatewayの構築を素振りしたので備忘録として残します。"
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

[Kubernates](https://kubernetes.io/) 環境で [Prometheus](https://prometheus.io/) と [Grafana](https://grafana.com/) と [pushgateway](https://github.com/prometheus/pushgateway) の構築を素振りしたので備忘録として残します。

リポジトリは以下

- [soudegesu/prometheus-pushgw-practice](https://github.com/soudegesu/prometheus-pushgw-practice)

<!--adsense-->

## やりたいこと

- [Prometheus](https://prometheus.io/) と [Grafana](https://grafana.com/) と [pushgateway](https://github.com/prometheus/pushgateway) を [Kubernates](https://kubernetes.io/) で管理する
- [Grafana](https://grafana.com/) は [Prometheus](https://prometheus.io/) をデータソースとして参照する
- [Prometheus](https://prometheus.io/) は [pushgateway](https://github.com/prometheus/pushgateway) からメトリクスをpullする

とりあえずは、ローカルマシン上での構築を目指します。構成としては以下の通りです。

![purpose](/images/20210122/purpose.drawio.png)

## 環境情報

- Mac OS X `11.1`
- Docker Desktop `3.0.0`
  - Docker `20.1.0`
  - Kubernates `1.19.3`

## 構築手順

今回の手順は [Prometheus+GrafanaでKubernetesクラスターを監視する ~Binaryファイルから起動+yamlファイルから構築~](https://qiita.com/FY0323/items/72616d6e280ec7f2fdaf) を参考にさせていただきつつ、個人的に欲しい部分を拡張しています。

### Kubernates Contextを指定する

任意のコンテキストで構いませんが今回は `docker-desktop` を指定します。

{{< highlight bash "linenos=inline" >}}
kubectl config use-context docker-desktop
{{</ highlight >}}

また、今回のnamespaceを `monitoring` にしておきます。

{{< highlight bash "linenos=inline" >}}
kubectl create namespace monitoring
{{</ highlight >}}

<!--adsense-->

### ClusterRoleとClusterRoleBindingの作成

まずは `ClusterRole` と `ClusterRoleBinding` を作成します。 `Role` と `RoleBinding` に変更して使ってもらっても構いません。

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

### pushgatewayを作成する

次に [pushgateway](https://github.com/prometheus/pushgateway) の定義を作成します。
ここでは `Deployment` と `Service` を作成しています。
以下の設定では、 別のPodからは `pushgateway-service:8120` で pushgateway にアクセスできるようになります。

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

### Prometheusを作成する

次に [Prometheus](https://prometheus.io/) の定義を作成します。ここでは `Deployment` と `Service` 以外にも `ConfigMap` を作成します。

[Prometheus](https://prometheus.io/)の設定ファイル(`prometheus.yml`)をConfigMapに定義してマウントさせることで設定を外出しします。

また、別のPodからは `prometheus-service:8080` で Prometheus にアクセスできるようになります。

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

### Grafanaを作成する

次に [Grafana](https://grafana.com/) の定義を作成します。ここでは `Deployment` と `Service` と `ConfigMap` を作成します。

定義ファイルが少し長くなってしまっていますが、ここでも同様に設定ファイルをConfigMapで作成しています。作成している定義ファイルは `データソースの定義` と `ダッシュボードの定義` と `ダッシュボードの設定` の3種類です。

ダッシュボードの設定については、設定ファイルから作成すると時間がかかるため、GUIから設定した定義をJSONとして出力して貼り付けると良いでしょう。

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

### applyする

最後に `kubectl apply` コマンドを実行し、コンテナを展開します。

{{< highlight bash "linenos=inline" >}}
kubectl apply -f ${name of pushgateway k8s file}.yml -n monitoring
kubectl apply -f ${name of prometheus k8s file}.yml -n monitoring
kubectl apply -f ${name of grafana k8s file}.yml -n monitoring
{{</ highlight >}}

Docker Desktopのダッシュボードを開き、無事deploymentコンテナが作成されていることを確認しましょう。

その後、ブラウザを開き、以下にてサービスの画面が表示されることを確認しましょう。

- Prometheus: `http://localhost:30000/`
- grafana: `http://localhost:30020/`

## 最後に

[Kubernates](https://kubernetes.io/) 環境で [Prometheus](https://prometheus.io/) と [Grafana](https://grafana.com/) と [pushgateway](https://github.com/prometheus/pushgateway) を構築する設定を作成しました。
今回の作業範囲では [Prometheus](https://prometheus.io/) のストレージボリュームを外部にマウントしていないので、必要な人は適宜設定してください。

## 参考にさせていただいたリンク

- [Prometheus+GrafanaでKubernetesクラスターを監視する ~Binaryファイルから起動+yamlファイルから構築~](https://qiita.com/FY0323/items/72616d6e280ec7f2fdaf)
