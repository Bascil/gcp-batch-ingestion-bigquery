terraform {
  backend "gcs" {
    bucket = "artisto-tf-state-gcp-batch-ingestion-bucket"
    prefix = "wirepeople-state"
  }
}

provider "google" {
  project = "artisto"
  region = "us-central1"
}

resource "google_storage_bucket" "my-bucket" {
  name = "artisto-batch-pipeline"
  storage_class = "REGIONAL"
  location  = "us-central1"
}
