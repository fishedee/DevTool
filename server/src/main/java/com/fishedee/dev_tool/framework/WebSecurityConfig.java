package com.fishedee.dev_tool.framework;

import com.fishedee.security_boost.SecurityBoostConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class WebSecurityConfig extends SecurityBoostConfiguration {
    @Override
    protected void configureAuthorizeRequests(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().permitAll();
    }
}
