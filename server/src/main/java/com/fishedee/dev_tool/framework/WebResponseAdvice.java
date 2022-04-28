package com.fishedee.dev_tool.framework;

import com.fishedee.web_boost.WebBoostResponseAdvice;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.fishedee.dev_tool")
public class WebResponseAdvice extends WebBoostResponseAdvice {
}
