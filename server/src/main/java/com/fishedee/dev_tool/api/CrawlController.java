package com.fishedee.dev_tool.api;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fishedee.jpa_boost.CurdFilter;
import com.fishedee.jpa_boost.CurdFilterBuilder;
import com.fishedee.jpa_boost.CurdFilterable;
import com.fishedee.web_boost.WebBoostException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crawl")
@Slf4j
public class CrawlController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestTemplate restTemplate;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DTO{
        @NotBlank
        private String url;

        @NotNull
        private Map<String,String> header = new HashMap<>();
    }
    
    @GetMapping("/get")
    public String get(DTO dto){
        HttpHeaders httpHeaders = new HttpHeaders();
        dto.header.forEach((key,value)->{
            httpHeaders.add(key,value);
        });
        HttpEntity<?> entity = new HttpEntity<>(httpHeaders);
        ResponseEntity<String> result = restTemplate.exchange(dto.getUrl(), HttpMethod.GET,entity,String.class);
        if( result.getStatusCode() != HttpStatus.OK){
            throw new WebBoostException(1,"返回的状态码为:"+result.getStatusCode(),null);
        }
        return result.getBody();
    }
}

