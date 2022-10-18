#bin/bash

######################################################
# 配置项
######################################################
# 应用名称
PROJECT_NAME="wise-vue2-cli-template"
SERVICE_PORT="80"

# docker 命名空间
DOCKER_NAMESPACE="wise-inc"

# docker 仓库地址
DOCKER_REGISTRY="192.168.60.120:8082"
# docker 账号
DOCKER_LOGIN_USERNAME="admin"
DOCKER_LOGIN_PASSWORD="123456"
# docker 镜像标签
DOCKER_TAG=$(date "+%Y%m%d%H%M%S")

# k8s 命名空间
K8S_NAMESPACE="default"
# k8s toleration value
K8S_TOLERATION_VALUE="dev"
# ingress host (服务的域名)
INGRESS_HOST="***.dev.eline56-inc.com"

# 前端构建后的文件路径(index.html文件所在的路径)
DIST="./dist/*"

# 安装依赖命令
INSTALL_DEPENDENCIES_COMMAND="npm install"
# 构建命令
BUILD_COMMAND="npm run build-dev"

# 前端项目配置的后端服务base url
BASE_URL="app-mobile.eline56.com"
# 后端服务接口地址的配置文件路径
BASE_URL_FILE_PATH="./src/constant/index.js"

# 后端服务地址
SERVER_DEV="192.168.60.120:31768"
SERVER_TEST="192.168.60.120:31868"
SERVER_PREPUB="192.168.60.120:31968"
SERVER_PROD="192.168.60.120:31780"

######################################################
# 使用说明，用来提示输入参数
######################################################
usage() {
    echo "Usage: sh deplay.sh [dev|test|prepub|prod]"
    exit 1
}

######################################################
# 开始部署
######################################################
start_deploy(){
  # 清空历史构建的文件
  rm -rf ./dist
  rm -rf ./docker/dist
  # 安装依赖
  echo "开始安装依赖"
  $INSTALL_DEPENDENCIES_COMMAND

  # 替换base Url
  sed -i "s/https:\/\/$BASE_URL/http:\/\/$SERVER_DEV/g" $BASE_URL_FILE_PATH

  # 构建
  echo "开始构建"
  $BUILD_COMMAND

  # 把构建完的文件移至docker构建目录
  mkdir -p ./docker/dist
  mv $DIST ./docker/dist

  # 进入docker目录
  cd ./docker

  # 替换nginx.conf后台服务地址
  echo "替换nginx.conf后台服务地址"
  sed -i "s/{gateway_server}/$SERVER_DEV/g" nginx.conf

  # 构建docker镜像
  echo "构建docker镜像"
  docker build -t $DOCKER_REGISTRY/$DOCKER_NAMESPACE/$PROJECT_NAME:$DOCKER_TAG .

  # 登录镜像服务并推送镜像
  echo "登录镜像服务并推送镜像"
  docker login -u $DOCKER_LOGIN_USERNAME -p $DOCKER_LOGIN_PASSWORD $DOCKER_REGISTRY
  docker push $DOCKER_REGISTRY/$DOCKER_NAMESPACE/$PROJECT_NAME:$DOCKER_TAG

  # 回到工作目录，映射的 k8s-config.yaml 文件在工作目录
  cd ../

  # 服务器重启或首次部署执行
  echo "部署 k8s 中的服务"
  sed -i "s/{project_name}/$PROJECT_NAME/g" ./k8s/deployment.yml
  sed -i "s/{k8s_namespace}/$K8S_NAMESPACE/g" ./k8s/deployment.yml
  sed -i "s/{docker_registry}/$DOCKER_REGISTRY/g" ./k8s/deployment.yml
  sed -i "s/{docker_namespace}/$DOCKER_NAMESPACE/g" ./k8s/deployment.yml
  sed -i "s/{docker_tag}/$DOCKER_TAG/g" ./k8s/deployment.yml
  sed -i "s/{service_port}/$SERVICE_PORT/g" ./k8s/deployment.yml
  sed -i "s/{toleration_value}/$K8S_TOLERATION_VALUE/g" ./k8s/deployment.yml
  kubectl --kubeconfig=k8s-config.yaml apply -f ./k8s/deployment.yml

  # 更新ingress
#  echo "部署 k8s 中的服务代理"
  sed -i "s/{project_name}/$PROJECT_NAME/g" ./k8s/ingress.yml
  sed -i "s/{k8s_namespace}/$K8S_NAMESPACE/g" ./k8s/ingress.yml
  sed -i "s/{ingress_host}/$INGRESS_HOST/g" ./k8s/ingress.yml
  sed -i "s/{service_port}/$SERVICE_PORT/g" ./k8s/ingress.yml
  kubectl --kubeconfig=k8s-config.yaml apply -f ./k8s/ingress.yml

  # 更新 k8s 中的服务镜像为新构建的镜像
  # echo "更新 k8s 中的服务镜像为新构建的镜像"
  # kubectl --kubeconfig=k8s-config.yaml -n $K8S_NAMESPACE set image deployment/$PROJECT_NAME $PROJECT_NAME=$DOCKER_REGISTRY/$DOCKER_NAMESPACE/$PROJECT_NAME:$DOCKER_TAG
}

######################################################
# 获取生成环境的镜像服务临时登录账号
######################################################
get_product_docker_registry_temp_access(){
  export PYTHONIOENCODING=utf8
  data=$(aliyun cr GET /tokens --endpoint=cr.cn-shanghai.aliyuncs.com)
  echo $data
  DOCKER_LOGIN_USERNAME=$(echo $data | python2 -c "import sys,json; print json.load(sys.stdin)[u'data'][u'tempUserName']")
  echo DOCKER_LOGIN_USERNAME
  DOCKER_LOGIN_PASSWORD=$(echo $data | python2 -c "import sys,json; print json.load(sys.stdin)[u'data'][u'authorizationToken']")
  echo DOCKER_LOGIN_PASSWORD
}

######################################################
# 根据输入参数，选择执行对应方法，不输入则执行使用说明
######################################################
case "$1" in
"dev")
    echo "开始部署 dev 环境"
    # 设置 k8s 命名空间
    K8S_NAMESPACE="default"
    BUILD_COMMAND="npm run build-dev"
    # 开始部署
    start_deploy
;;
"test")
    echo "开始部署 test 环境"
    BUILD_COMMAND="npm run build-test"
    INGRESS_HOST="user.test.eline56-inc.com"
    # 设置 k8s 命名空间
    K8S_NAMESPACE="wise-test"
    K8S_TOLERATION_VALUE="test"
    # 开始部署
    start_deploy
;;
"prepub")
    echo "开始部署 prepub 环境"
    BUILD_COMMAND="npm run build-prepub"
    INGRESS_HOST="user.prepub.eline56-inc.com"
    # 设置 k8s 命名空间
    K8S_NAMESPACE="wise-prepub"
    K8S_TOLERATION_VALUE="prepub"
    # 开始部署
    start_deploy
;;
"prod")
    echo "开始部署 prod 环境"
    BUILD_COMMAND="npm run build-prod"
    echo "生成生产环境 docker 镜像标签"
    # 获取当前分支的 git tag, 如果没有，则使用分支名
    DOCKER_TAG=$(git describe --tags HEAD || rev-parse --abbrev-ref HEAD | grep -v HEAD || rev-parse HEAD)
    echo "docker tag: $DOCKER_TAG"
    DOCKER_REGISTRY="registry.cn-shanghai.aliyuncs.com"

    # 设置 k8s 命名空间
    K8S_NAMESPACE="wise-prod"
    # 获取生成环境的镜像服务临时登录账号
    get_product_docker_registry_temp_access
    # 开始部署
    start_deploy
;;
*)
    start_deploy
;;
esac

