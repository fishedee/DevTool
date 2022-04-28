package com.fishedee.dev_tool;

import com.fishedee.jpa_boost.lint.EnableJPALint;
import com.fishedee.dev_tool.framework.MyLinter;
import com.fishedee.util_boost.utils.BaseEntityType;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.util.TimeZone;

/**
 * Hello world!
 *
 */
@SpringBootApplication
@EnableTransactionManagement(proxyTargetClass = true)
@EnableAspectJAutoProxy(exposeProxy = true)
@EnableJPALint(
        allowIdHaveGeneratedValue = true,
        superEntityClass = BaseEntityType.class,
        extraLinters = {
                MyLinter.class,
        }
)
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class App 
{
    public static void main( String[] args )
    {
        SpringApplication.run(App.class,args);
    }

    @PostConstruct
    void started()
    {
        //设置时区
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
    }

    @Bean
    public RestTemplate getTemplate(RestTemplateBuilder builder){
        return builder.setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(50))
                .build();
    }
}
