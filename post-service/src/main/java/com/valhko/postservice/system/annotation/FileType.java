package com.valhko.postservice.system.annotation;

import com.valhko.postservice.system.validation.FileTypeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = FileTypeValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface FileType {

    String message() default "Invalid file type";
    String[] types();


    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
