create table media
(
    id                 varchar(255) not null,
    container_name     varchar(255),
    content_type       varchar(255),
    created_at         timestamp(6),
    extension          varchar(255),
    file_name          varchar(255),
    item_id            varchar(255),
    item_type          smallint check (item_type between 0 and 4),
    original_file_name varchar(255),
    size               bigint,
    storage_name       varchar(255),
    type               smallint check (type between 0 and 2),
    uploaded_by        varchar(255),
    url                varchar(255),
    primary key (id)
);
create table outbox_event
(
    event_id       varchar(255) not null,
    aggregate_id   varchar(255) not null,
    aggregate_type varchar(100) not null,
    delivered      boolean      not null,
    event_type     varchar(100) not null,
    payload        text         not null,
    timestamp      timestamp(6),
    topic          varchar(255) not null,
    version        integer      not null,
    primary key (event_id)
);
create index IDX40rw2qaro6pl8n09h2q3g0420 on media (item_id)