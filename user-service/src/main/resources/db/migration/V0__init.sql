create table badge
(
    id          varchar(255) not null,
    created_at  timestamp(6),
    status      smallint check (status between 0 and 1),
    type        smallint check (type between 0 and 2),
    updated_at  timestamp(6),
    valid_until date,
    "owner_id"  varchar(255),
    primary key (id)
);
create table badge_request
(
    id             varchar(255) not null,
    content        TEXT,
    created_at     timestamp(6),
    done           boolean      not null,
    status         smallint check (status between 0 and 2),
    type           smallint check (type between 0 and 2),
    updated_at     timestamp(6),
    valid_until    date,
    "requester_id" varchar(255),
    primary key (id)
);
create table badge_request_attachments_ids
(
    badge_request_id varchar(255) not null,
    attachments_ids  varchar(255)
);
create table network
(
    id              varchar(255) not null,
    "networked_id"  varchar(255),
    "networking_id" varchar(255),
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
create table role
(
    id   varchar(255) not null,
    name varchar(255) not null,
    primary key (id)
);
create table "user"
(
    id               varchar(255) not null,
    avatar_url       varchar(255),
    balance          numeric(38, 2),
    banner_image_url varchar(255),
    bio              varchar(255),
    birth_date       date,
    city             varchar(255),
    country          varchar(255),
    created_at       timestamp(6),
    email            varchar(255),
    first_name       varchar(255),
    job_company      varchar(255),
    last_name        varchar(255),
    password         varchar(255),
    preferences      varchar(255),
    title            varchar(255),
    updated_at       timestamp(6),
    username         varchar(255),
    primary key (id)
);
create table "user_roles"
(
    "users_id" varchar(255) not null,
    roles_id   varchar(255) not null,
    primary key ("users_id", roles_id)
);
alter table if exists role
    drop constraint if exists UK8sewwnpamngi6b1dwaa88askk;
alter table if exists role
    add constraint UK8sewwnpamngi6b1dwaa88askk unique (name);
alter table if exists "user"
    drop constraint if exists UK5c856itaihtmi69ni04cmpc4m;
alter table if exists "user"
    add constraint UK5c856itaihtmi69ni04cmpc4m unique (username);
alter table if exists "user"
    drop constraint if exists UKhl4ga9r00rh51mdaf20hmnslt;
alter table if exists "user"
    add constraint UKhl4ga9r00rh51mdaf20hmnslt unique (email);
alter table if exists badge
    add constraint FK4yoc1hothqv2sf4yvorq4cfl foreign key ("owner_id") references "user";
alter table if exists badge_request
    add constraint FKggntrg40lun1fuuwadmlo25rc foreign key ("requester_id") references "user";
alter table if exists badge_request_attachments_ids
    add constraint FK5k4gox9o151mjrt5v53e0wrws foreign key (badge_request_id) references badge_request;
alter table if exists network
    add constraint FKdnc7bhdxpwowgr8wu7u8woapk foreign key ("networked_id") references "user";
alter table if exists network
    add constraint FK43n7q4fbqbil71acpwqx20xoe foreign key ("networking_id") references "user";
alter table if exists "user_roles"
    add constraint FKsoyrbfa9510yyn3n9as9pfcsx foreign key (roles_id) references role;
alter table if exists "user_roles"
    add constraint FKayp8a554n3beny1eifp5ct9nt foreign key ("users_id") references "user";

insert into role values ('904c3d39-af9a-4d7a-a633-a2dcdef7eb81', 'ROLE_USER');
insert into role values ('9626a7a8-2e84-4f33-b657-74902ffd8ef2', 'ROLE_ADMIN');