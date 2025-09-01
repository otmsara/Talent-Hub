package com.valhko.userservice.system.validation;

import com.valhko.userservice.system.annotation.FileType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class FileTypeValidator implements ConstraintValidator<FileType, MultipartFile> {

    // List of permitted MIME types
    private List<String> allowedTypes;

    @Override
    public void initialize(FileType constraintAnnotation) {
        allowedTypes = List.of(constraintAnnotation.types());
    }

    // Perform the validation
    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        // Validate file type
        String contentType = file.getContentType();

        return allowedTypes.contains(contentType);
    }
}
