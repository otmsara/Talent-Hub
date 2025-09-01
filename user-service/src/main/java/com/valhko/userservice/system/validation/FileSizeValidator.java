package com.valhko.userservice.system.validation;

import com.valhko.userservice.system.annotation.FileSize;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class FileSizeValidator implements ConstraintValidator<FileSize, MultipartFile> {

    private double max;

    @Override
    public void initialize(FileSize constraintAnnotation) {
        max = constraintAnnotation.max();
    }

    // Perform the validation
    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        return file.getSize() <= max * 1024 * 1024;
    }
}
