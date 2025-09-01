package com.valhko.postservice.system.validation;

import com.valhko.postservice.system.annotation.FileType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class FileTypeValidator implements ConstraintValidator<FileType, MultipartFile[]> {

    // List of permitted MIME types
    private List<String> allowedTypes;

    @Override
    public void initialize(FileType constraintAnnotation) {
        allowedTypes = List.of(constraintAnnotation.types());
    }

    // Perform the validation
    @Override
    public boolean isValid(MultipartFile[] files, ConstraintValidatorContext context) {
        if (files == null) {
            return true;
        }
        for (MultipartFile file : files) {
            if (!allowedTypes.contains(file.getContentType())) {
                return false;
            }
        }
        return true;
    }
}
