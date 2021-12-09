terraform {
  backend "gcs" {
    bucket = "tf-state-gcp-batch-ingestion"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = "artisto"
  region = "australia-southeast1-a"
}

resource "google_storage_bucket" "artisto-funky-bucket" {
  name = "artisto-batch-pipeline"
  storage_class = "REGIONAL"
  location  = "australia-southeast1"
}
