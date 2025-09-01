package com.valhko.userservice.system.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Param;

public class UploadFileDtoExpander implements Param.Expander {
    private final ObjectMapper mapper = new ObjectMapper();
    
    @Override
    public String expand(Object value) {
        try {
            return mapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting metadata to JSON", e);
        }
    }
}
