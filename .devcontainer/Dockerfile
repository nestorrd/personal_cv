FROM golang:1.23.4-bookworm

# Crear usuario no-root para desarrollo
RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid vscode --shell /bin/bash --create-home vscode

# Instalar Node.js y npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Instalar herramientas adicionales
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        curl \
        wget \
        unzip \
        git \
        make \
        build-essential \
        ca-certificates \
        gnupg \
        lsb-release \
        nginx \
        tree \
        htop \
        vim \
        nano \
        sudo \
        lsof \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Agregar usuario vscode al grupo sudo
RUN echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

# Instalar herramientas de Go como usuario vscode
USER vscode
RUN go install -v golang.org/x/tools/gopls@latest \
    && go install -v github.com/go-delve/delve/cmd/dlv@latest \
    && go install -v honnef.co/go/tools/cmd/staticcheck@latest \
    && go install -v github.com/fatih/gomodifytags@latest \
    && go install -v github.com/josharian/impl@latest \
    && go install -v github.com/cweill/gotests/gotests@latest \
    && go install -v github.com/air-verse/air@latest

# Volver a root para instalar paquetes npm globales
USER root
RUN npm install -g \
    live-server \
    http-server \
    concurrently \
    nodemon \
    prettier \
    eslint

# Crear directorio de workspace
RUN mkdir -p /workspace \
    && chown -R vscode:vscode /workspace

# Configurar permisos para el directorio home de vscode
RUN chown -R vscode:vscode /home/vscode

# Cambiar a usuario vscode
USER vscode
WORKDIR /workspace

# Configurar variables de entorno de Go
ENV GO111MODULE=on
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org
ENV PATH="/home/vscode/go/bin:${PATH}"
ENV GOPATH="/home/vscode/go"

# Comando por defecto
CMD ["sleep", "infinity"]