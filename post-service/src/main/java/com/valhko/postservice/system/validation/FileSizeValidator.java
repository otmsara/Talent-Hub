package com.valhko.postservice.system.validation;

import com.valhko.postservice.system.annotation.FileSize;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class FileSizeValidator implements ConstraintValidator<FileSize, MultipartFile[]> {

    private double max;

    @Override
    public void initialize(FileSize constraintAnnotation) {
        max = constraintAnnotation.max();
    }

    // Perform the validation
    @Override
    public boolean isValid(MultipartFile[] files, ConstraintValidatorContext context) {
        if (files == null) {
            return true;
        }
        for (MultipartFile file : files) {
            if (file.getSize() > max * 1024 * 1024) {
                return false;
            }
        }
        return true;
    }
}
