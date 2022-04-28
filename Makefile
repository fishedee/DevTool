DIRECTORY=/home/fish/Project
TARGET=devtool
HOST=fish@idc.fishedee.com
.PHONY:deploy zip build
deploy:build zip upload remote_stop remote_combine remote_start clean
	echo "deploy success"
clean:
	rm -rf $(TARGET)
	rm -rf $(TARGET).tar.gz
remote_start:
	ssh -t $(HOST) "sudo supervisorctl restart $(TARGET)"
remote_combine:
	-ssh $(HOST) "rm -rf $(DIRECTORY)/$(TARGET)_new"
	ssh $(HOST) "mkdir $(DIRECTORY)/$(TARGET)_new"
	ssh $(HOST) "tar -zxvf $(DIRECTORY)/$(TARGET).tar.gz -C $(DIRECTORY)/$(TARGET)_new"
	#先进行不覆盖的合并
	ssh $(HOST) "cp -r -n $(DIRECTORY)/$(TARGET)_new/$(TARGET)/* $(DIRECTORY)/$(TARGET)"
	#指定文件必须覆盖
	ssh $(HOST) "cp $(DIRECTORY)/$(TARGET)_new/$(TARGET)/$(TARGET)-1.0.jar $(DIRECTORY)/$(TARGET)"
	ssh $(HOST) "cp $(DIRECTORY)/$(TARGET)_new/$(TARGET)/Makefile $(DIRECTORY)/$(TARGET)"
	ssh $(HOST) "cp $(DIRECTORY)/$(TARGET)_new/$(TARGET)/nginx/$(TARGET) $(DIRECTORY)/$(TARGET)/nginx"
	ssh $(HOST) "cp -r $(DIRECTORY)/$(TARGET)_new/$(TARGET)/static/* $(DIRECTORY)/$(TARGET)/static"
	ssh $(HOST) "rm -rf $(DIRECTORY)/$(TARGET).tar.gz"
	ssh $(HOST) "rm -rf $(DIRECTORY)/$(TARGET)_new"
remote_stop:
	echo "nothing"
	#-ssh $(HOST) "cd $(DIRECTORY)/$(TARGET) && make stop"
upload:
	-ssh $(HOST) "rm -rf $(DIRECTORY)/$(TARGET).tar.gz"
	scp $(TARGET).tar.gz $(HOST):$(DIRECTORY)/$(TARGET).tar.gz
zip:build
	tar -zcvf $(TARGET).tar.gz $(TARGET)/*
build:
	cd server && SPRING_PROFILES_ACTIVE=test mvn package
	cd static && npm run build
	-rm -rf $(TARGET)
	mkdir $(TARGET)
	cp server/target/$(TARGET)-1.0.jar $(TARGET)
	cp -r data/bash/Makefile $(TARGET)
	cp -r data/nginx $(TARGET)
	cp -r static/dist  $(TARGET)/static

