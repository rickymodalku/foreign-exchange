#!/bin/bash
set -xe
folder_name='modalku.co.id'
temp_name='dist-id-1'
server_name='root@id-server1'
echo "Building ${folder_name} Production Website For CBN servers"
npm run build-production-id
echo "Zipping.."
zip -r ${temp_name}.zip dist/
echo "Copying ${temp_name}.zip to CBN in /var/www/${folder_name}"
scp ${temp_name}.zip ${server_name}:/var/www/$folder_name/
echo "Unpacking ${temp_name}.zip to /var/www/$folder_name/${temp_name}"
ssh ${server_name} "unzip /var/www/${folder_name}/${temp_name}.zip -d /var/www/$folder_name/${temp_name}"
ssh ${server_name} "rm -rf /var/www/$folder_name/prev-dist/*"
ssh ${server_name} "mv /var/www/$folder_name/dist /var/www/$folder_name/prev-dist"
echo "Move ${temp_name}/dist to /var/www/$folder_name/dist"
ssh ${server_name} "mv /var/www/$folder_name/${temp_name}/dist /var/www/$folder_name/dist"
echo "Cleaning up"
ssh ${server_name} "rm /var/www/$folder_name/${temp_name}.zip"
ssh ${server_name} "rmdir /var/www/$folder_name/${temp_name}"
rm ${temp_name}.zip
echo "Cleaned up done. Deployment successful"