sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install terraform

echo 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 | gh auth login --with-token
