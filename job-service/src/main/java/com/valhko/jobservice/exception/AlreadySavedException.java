package com.valhko.jobservice.exception;

public class AlreadySavedException extends RuntimeException {
    public AlreadySavedException(String message) {
        super(message);
    }
}