//gcloud --project=grey-sort-challenge functions deploy goWithTheDataFlow --stage-bucket gs://batch-pipeline --trigger-bucket gs://batch-pipeline
const { google } = require('googleapis');
exports.goWithTheDataFlow = function (data, context, callback) {
  const gcsEvent = data;
  const file = gcsEvent.name;
  const bucket = gcsEvent.bucket;

  if (
    context.eventType === 'google.storage.object.finalize' &&
    file.indexOf('upload/') !== -1
  ) {
    console.log(`Processing file: ${gcsEvent.name}`);
    console.log(`Event ${context.eventId}`);
    console.log(`Event Type: ${context.eventType}`);
    console.log(`Bucket: ${gcsEvent.bucket}`);
    console.log(`Created: ${gcsEvent.timeCreated}`);
    console.log(`Updated: ${gcsEvent.updated}`);

    google.auth.getApplicationDefault(function (err, authClient, projectId) {
      if (err) {
        throw err;
      }
      if (
        authClient.createScopedRequired &&
        authClient.createScopedRequired()
      ) {
        authClient = authClient.createScoped([
          'https://www.googleapis.com/auth/cloud-platform',
          'https://www.googleapis.com/auth/userinfo.email',
        ]);
      }
      const dataflow = google.dataflow({
        version: 'v1b3',
        auth: authClient,
      });

      console.log('Project Id', projectId);

      dataflow.projects.templates.create(
        {
          projectId: projectId,
          resource: {
            parameters: {
              inputFile: `gs://${bucket}/${file}`,
            },
            jobName:
              'dataflow-triggered-by-cloud-function-' + new Date().getTime(),
            gcsPath: 'gs://artisto-batch-pipeline/template/pipeline',
          },
        },
        function (err, response) {
          if (err) {
            console.error(
              'Problems occurred while running dataflow template, error was: ',
              err
            );
          }
          console.log('The dataflow template response: ', response);
          return;
          //callback();
        }
      );
    });
  } else {
    console.log('Nothing to do here, ignoring.');
    return;
    //callback();
  }
};
