package com.valhko.userservice.system.annotation;

import com.valhko.userservice.system.validation.FileSizeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = FileSizeValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface FileSize {

    String message() default "File size exceeded";

    double max();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
