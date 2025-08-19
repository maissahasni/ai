package tn.vermeg.eduvermeg.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource,String field, Object value) {
        super(String.format("Resource %s not found for %s field %s value %s", resource, field, value));
    }
}
