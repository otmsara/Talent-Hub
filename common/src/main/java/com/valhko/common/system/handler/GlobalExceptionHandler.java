package com.valhko.common.system.handler;

import com.valhko.common.system.dto.response.Result;
import com.valhko.common.system.exception.ConflictException;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.common.system.util.StatusCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public Result<?> handleResourceNotFound(ResourceNotFoundException ex) {
        return new Result<>(false, StatusCode.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Result<?> handleConflict(ConflictException ex) {
        return new Result<>(false, StatusCode.CONFLICT, ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Map<String, String>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> map = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            // Get field name from the error object
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            map.put(fieldName, errorMessage);
        });
        return new Result<>(false, StatusCode.BAD_REQUEST, "Provided arguments are invalid, see data for details", map);
    }

    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public Result<?> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        return new Result<>(false, StatusCode.PAYLOAD_TOO_LARGE, "Maximun upload size excedded");
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(InvalidArgumentsException.class)
    public Result<?> handleInvalidArguments(InvalidArgumentsException ex) {
        return new Result<>(false, StatusCode.INVALID_ARGUMENTS, ex.getMessage());
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(ForbiddenRequestException.class)
    public Result<?> handleForbidden(ForbiddenRequestException ex) {
        return new Result<>(false, StatusCode.FORBIDDEN, ex.getMessage());
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public Result<?> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = "The '" + ex.getName() + "' argument is invalid.";
        Class<?> requiredType = Objects.requireNonNull(ex.getRequiredType());
        if (requiredType.isEnum()) {
            String constants = Arrays.toString(requiredType.getEnumConstants());
            message += " expected " + constants + ". but, got '" + ex.getValue() + "'";
        }
        return new Result<>(false, StatusCode.INVALID_ARGUMENTS, message);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public Result<?> handleMissingServletRequestParameter(MissingServletRequestParameterException ex) {
        return new Result<>(false, StatusCode.INVALID_ARGUMENTS, "The '" + ex.getParameterName() + "' argument is missing.");
    }

    @ExceptionHandler(AsyncRequestTimeoutException.class)
    public ResponseEntity<String> handleAsyncRequestTimeoutException(AsyncRequestTimeoutException ex) {
        // This is often just a client disconnect, so we can log it or handle it quietly
        log.error("SSE connection timed out or client disconnected");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Fallback for any unhandled exceptions
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<?> handleGlobalException(Exception ex) {
        String message = "An unexpected error occurred. Please try again later.";
        log.error("Unhandled exception caught: {}: {}", ex.getClass().getSimpleName(), ex.getMessage());
        return new Result<>(false, StatusCode.INTERNAL_SERVER_ERROR, message);
    }
}
