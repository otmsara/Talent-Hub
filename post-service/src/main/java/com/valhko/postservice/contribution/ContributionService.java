package com.valhko.postservice.contribution;

public interface ContributionService {
    Contribution create(Contribution item);

    Contribution findById(String id);

    Contribution update(String id, Contribution item);

    void deleteById(String id);
}
