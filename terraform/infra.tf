terraform {
  backend "gcs" {
    bucket = "artisto-terraform-state-gcp-batch-ingestion"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = "artisto-323218"
  region = "us-central1"
}

resource "google_storage_bucket" "bucket" {
  name = "artisto-batch-pipeline"
  storage_class = "REGIONAL"
  location  = "us-central1"
}
