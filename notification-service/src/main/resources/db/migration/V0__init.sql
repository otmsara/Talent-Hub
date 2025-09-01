create table notification
(
    id                varchar(255) not null,
    created_at        timestamp(6),
    message           varchar(255),
    notification_type smallint check (notification_type between 0 and 4),
    read              boolean      not null,
    seen              boolean      not null,
    source_id         varchar(255),
    target_id         varchar(255),
    updated_at        timestamp(6),
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
)