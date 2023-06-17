// Reference: https://developer.hashicorp.com/terraform/tutorials/kubernetes/gke
resource "google_container_cluster" "my_cluster" {
  name = "b00929627-kubernetes-cluster"
  location = "us-central1-a"
  initial_node_count = 1
  enable_autopilot = false

  node_config {
    metadata = {
      disable-legacy-endpoints = "true"
    }

    taint {
      key    = "special"
      value  = "true"
      effect = "NO_SCHEDULE"
    }

    disk_size_gb = 10
    machine_type = "e2-micro"
    preemptible  = false
    disk_type = "pd-standard"
  }
}