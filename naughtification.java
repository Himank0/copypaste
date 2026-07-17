// src/main/java/com/taskbridge/notification/repository/NotificationRepository.java
package com.taskbridge.notification.repository;

import com.taskbridge.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndReadFalse(Long userId);
    List<Notification> findByOrganisationIdAndReadFalse(Long organisationId);
    List<Notification> findByProjectId(Long projectId);
}
