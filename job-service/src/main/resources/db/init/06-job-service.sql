CREATE DATABASE job_service;

\c job_service;

CREATE TABLE job (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    location VARCHAR(255),
    salary DOUBLE PRECISION,
    is_remote BOOLEAN,
    company_id BIGINT,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_required_skills (
    job_id BIGINT NOT NULL,
    required_skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id, required_skill),
    FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE
);

CREATE TABLE application (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(50),
    cover_letter TEXT,
    resume_url VARCHAR(255),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phase VARCHAR(50),
    FOREIGN KEY (job_id) REFERENCES job(id),
    UNIQUE (user_id, job_id)
);

CREATE TABLE saved_job (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job(id),
    UNIQUE (user_id, job_id)
);

CREATE INDEX idx_job_company ON job(company_id);
CREATE INDEX idx_job_status ON job(status);
CREATE INDEX idx_application_user ON application(user_id);
CREATE INDEX idx_application_job ON application(job_id);
CREATE INDEX idx_saved_job_user ON saved_job(user_id);